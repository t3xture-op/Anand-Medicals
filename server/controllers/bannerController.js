// controllers/bannerController.js
import Banner from '../models/Banner.js';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

export async function getAllBanners(req, res) {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Failed to fetch banners' });
  }
}


export async function addBanner(req, res) {
  try {
    const { name ,link ,description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Banner name is required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'banners',
    });

    const newBanner = new Banner({
      name,
      image: result.secure_url,
      link,
      description
    });

    await newBanner.save();

    res.status(201).json(newBanner);
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({ message: 'Failed to add banner' });
  }
}

export async function deleteBanner(req, res) {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    const publicId = extractPublicId(banner.image);
    await cloudinary.uploader.destroy(publicId);

    await banner.deleteOne();
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Failed to delete banner' });
  }
}
