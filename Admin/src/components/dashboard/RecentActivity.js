import React from 'react';
import { 
  ShoppingBag, 
  User, 
  FileText, 
  AlertTriangle,
  Clock
} from 'lucide-react';

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'user':
        return <User className="h-4 w-4 text-green-500" />;
      case 'prescription':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'stock':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (!activities || activities.length === 0) {
    return <p className="text-sm text-gray-500">No recent activity found.</p>;
  }

  return (
    <div className="space-y-4  text-black ">
      {activities.map((activity) => (
        <div key={activity._id} className="flex items-start">
          <div className="mr-3 flex-shrink-0 rounded-full bg-gray-100 p-2  dark:bg-[#21262d]">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white ">{activity.title}</p>
            <p className="text-xs text-gray-500 dark:text-white-600 ">{activity.message}</p>
            <p className="text-xs text-gray-400 ">{formatDateTime(activity.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
