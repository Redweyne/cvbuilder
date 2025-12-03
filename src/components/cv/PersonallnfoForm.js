import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export default function PersonalInfoForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
        <p className="text-sm text-slate-500 mb-6">Add your contact details and professional summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-slate-700">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="full_name"
              value={data?.full_name || ''}
              onChange={(e) => handleChange('full_name', e.target.value)}
              className="pl-10"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              value={data?.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="pl-10"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700">Phone</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="phone"
              value={data?.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="pl-10"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-slate-700">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="location"
              value={data?.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="pl-10"
              placeholder="New York, NY"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-slate-700">LinkedIn</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="linkedin"
              value={data?.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="pl-10"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-slate-700">Website/Portfolio</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="website"
              value={data?.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="pl-10"
              placeholder="johndoe.com"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary" className="text-slate-700">Professional Summary</Label>
        <Textarea
          id="summary"
          value={data?.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="A brief summary highlighting your key skills, experience, and career goals..."
          className="min-h-[120px] resize-none"
        />
        <p className="text-xs text-slate-500">
          Tip: Keep it 2-3 sentences. Focus on your most relevant skills and achievements.
        </p>
      </div>
    </div>
  );
}