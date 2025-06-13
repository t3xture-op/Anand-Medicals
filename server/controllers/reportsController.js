import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';


//dashboard status
export async function getDashboardStats(req, res) {
  try {
    // Total Sales: Only completed and not refunded/cancelled
    const totalSalesAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          status: { $nin: ['refunded', 'cancelled'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Sales chart: monthly completed & non-refunded orders
    const salesChartAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          status: { $nin: ['refunded', 'cancelled'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const salesChart = {
      labels: salesChartAgg.map(d =>
        `${String(d._id.month).padStart(2, '0')}/${d._id.year}`
      ),
      data: salesChartAgg.map(d => d.total)
    };

    // Order status chart
    const orderStatusAgg = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const orderStatusChart = {
      labels: orderStatusAgg.map(item => item._id || 'Unknown'),
      data: orderStatusAgg.map(item => item.count)
    };

    // Top-selling products
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed',
          status: { $nin: ['refunded', 'cancelled'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sold: { $sum: '$items.quantity' },
          revenue: {
            $sum: {
              $multiply: ['$items.price', '$items.quantity']
            }
          }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: {
          path: '$productDetails',
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $project: {
          id: '$_id',
          name: '$productDetails.name',
          manufacturer: '$productDetails.manufacturer',
          sold: 1,
          revenue: 1
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 }
    ]);

    // User registration chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // start of month

    const userAgg = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const userChart = {
      labels: userAgg.map(d =>
        `${String(d._id.month).padStart(2, '0')}/${d._id.year}`
      ),
      data: userAgg.map(d => d.count)
    };

    // Final response
    res.json({
      totalSales,
      totalOrders,
      totalProducts,
      totalUsers,
      salesChart,
      orderStatusChart,
      topSellingProducts,
      userChart
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}





//download pdf report

export async function downloadReport(req, res) {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: 'Report type is required' });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text(`${type.replace(/-/g, ' ').toUpperCase()} Report`, { align: 'center' }).moveDown();

    // 🟢 SALES REPORT
    if (type === 'sales') {
      const orders = await Order.find();
      let totalRevenue = 0;

      orders.forEach(order => {
        order.items.forEach(item => {
          totalRevenue += item.quantity * item.price;
        });
      });

      const totalOrders = orders.length;

      doc.fontSize(12).text(`Total Revenue: ₹${totalRevenue.toLocaleString()}`);
      doc.text(`Total Orders: ${totalOrders}`);
    }

    // 🟢 ORDER STATUS REPORT
    else if (type === 'orders') {
      const orders = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);

      if (orders.length === 0) {
        doc.text("No order data available.");
      } else {
        orders.forEach(o => {
          doc.text(`${o._id}: ${o.count}`);
        });
      }
    }

    // 🟢 USER REGISTRATION REPORT
    else if (type === 'users') {
      const users = await User.find().sort({ createdAt: -1 }).select('name email createdAt');

      if (users.length === 0) {
        doc.text("No user data available.");
      } else {
        users.forEach(u => {
          doc.text(`${u.name} - ${u.email} - ${new Date(u.createdAt).toLocaleDateString()}`);
        });
      }
    }

    // 🟢 PRODUCT PERFORMANCE REPORT
    else if (type === 'products') {
      const topProducts = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalSold: { $sum: "$items.quantity" },
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        {
          $addFields: {
            productId: { $toObjectId: "$_id" }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            name: "$productDetails.name",
            manufacturer: "$productDetails.manufacturer",
            totalSold: 1,
            totalRevenue: 1
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }
      ]);

      if (topProducts.length === 0) {
        doc.text("No product performance data available.");
      } else {
        topProducts.forEach(p => {
          doc.text(`${p.name} | ${p.manufacturer} | Sold: ${p.totalSold} | Revenue: ₹${p.totalRevenue.toLocaleString()}`);
        });
      }
    }

    // ❌ UNKNOWN TYPE
    else {
      doc.text("Unknown report type.");
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
  }
}