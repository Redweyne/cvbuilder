import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Smile, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const iconCategories = {
  contact: {
    label: 'Contact',
    icons: ['Mail', 'Phone', 'MapPin', 'Globe', 'Link', 'AtSign', 'MessageCircle', 'Send', 'Inbox', 'PhoneCall', 'Video', 'Voicemail']
  },
  social: {
    label: 'Social',
    icons: ['Linkedin', 'Github', 'Twitter', 'Facebook', 'Instagram', 'Youtube', 'Twitch', 'Rss', 'Share2', 'Users', 'UserPlus', 'Heart']
  },
  work: {
    label: 'Work',
    icons: ['Briefcase', 'Building', 'Building2', 'Landmark', 'Factory', 'Store', 'Warehouse', 'Home', 'DollarSign', 'CreditCard', 'Wallet', 'Receipt', 'PiggyBank', 'TrendingUp', 'BarChart', 'LineChart', 'PieChart']
  },
  education: {
    label: 'Education',
    icons: ['GraduationCap', 'Book', 'BookOpen', 'Library', 'School', 'Pencil', 'PenTool', 'FileText', 'Notebook', 'ScrollText', 'Award', 'Medal', 'Trophy', 'Star', 'Certificate']
  },
  tech: {
    label: 'Tech',
    icons: ['Code', 'Code2', 'Terminal', 'Monitor', 'Laptop', 'Smartphone', 'Tablet', 'Server', 'Database', 'Cloud', 'Cpu', 'HardDrive', 'Wifi', 'Bluetooth', 'Settings', 'Cog', 'Wrench', 'Hammer', 'Bug', 'GitBranch', 'GitCommit', 'GitMerge', 'GitPullRequest']
  },
  design: {
    label: 'Design',
    icons: ['Palette', 'Paintbrush', 'Brush', 'Pipette', 'Scissors', 'Ruler', 'Layout', 'Grid', 'Layers', 'Box', 'Circle', 'Square', 'Triangle', 'Hexagon', 'Pentagon', 'Octagon', 'Figma', 'Image', 'Camera', 'Film']
  },
  arrows: {
    label: 'Arrows',
    icons: ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowUpRight', 'ArrowDownRight', 'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown', 'ChevronsRight', 'ChevronsLeft', 'MoveRight', 'MoveLeft', 'CornerDownRight', 'CornerUpRight']
  },
  actions: {
    label: 'Actions',
    icons: ['Check', 'CheckCircle', 'CheckSquare', 'X', 'XCircle', 'Plus', 'PlusCircle', 'Minus', 'MinusCircle', 'Edit', 'Edit2', 'Edit3', 'Trash2', 'Copy', 'Clipboard', 'Save', 'Download', 'Upload', 'RefreshCw', 'RotateCw']
  },
  objects: {
    label: 'Objects',
    icons: ['Calendar', 'Clock', 'Timer', 'Hourglass', 'Bell', 'Flag', 'Bookmark', 'Tag', 'Tags', 'Key', 'Lock', 'Unlock', 'Shield', 'Eye', 'EyeOff', 'Search', 'ZoomIn', 'ZoomOut', 'Filter', 'List']
  },
  misc: {
    label: 'Misc',
    icons: ['Sparkles', 'Zap', 'Flame', 'Sun', 'Moon', 'CloudSun', 'Snowflake', 'Umbrella', 'Lightbulb', 'Rocket', 'Plane', 'Car', 'Bike', 'Train', 'Ship', 'Anchor', 'Compass', 'Map', 'Navigation', 'Target', 'Crosshair', 'Activity', 'Thermometer', 'Scale', 'Gauge']
  }
};

export default function IconPicker({ onSelectIcon, trigger }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('contact');

  const allIcons = useMemo(() => {
    const icons = [];
    Object.values(iconCategories).forEach(category => {
      category.icons.forEach(iconName => {
        if (!icons.includes(iconName)) {
          icons.push(iconName);
        }
      });
    });
    return icons;
  }, []);

  const filteredIcons = useMemo(() => {
    if (searchTerm) {
      return allIcons.filter(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return iconCategories[activeCategory]?.icons || [];
  }, [searchTerm, activeCategory, allIcons]);

  const handleSelectIcon = (e, iconName) => {
    e.stopPropagation();
    e.preventDefault();
    onSelectIcon(iconName);
    setOpen(false);
    setSearchTerm('');
  };

  const renderIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Smile className="w-4 h-4" />
            Add Icon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Icon Library
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {!searchTerm && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid grid-cols-5 gap-1 mb-4 h-auto flex-wrap">
              {Object.entries(iconCategories).slice(0, 5).map(([key, { label }]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsList className="grid grid-cols-5 gap-1 mb-4 h-auto">
              {Object.entries(iconCategories).slice(5).map(([key, { label }]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = LucideIcons[iconName];
              if (!IconComponent) return null;
              
              return (
                <button
                  key={iconName}
                  onClick={(e) => handleSelectIcon(e, iconName)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex flex-col items-center gap-1 group"
                  title={iconName}
                  type="button"
                >
                  <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                  <span className="text-[9px] text-slate-400 truncate w-full text-center">
                    {iconName.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </button>
              );
            })}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No icons found for "{searchTerm}"
            </div>
          )}
        </div>
        
        <div className="text-xs text-slate-400 mt-4 text-center">
          {filteredIcons.length} icons available
        </div>
      </DialogContent>
    </Dialog>
  );
}
