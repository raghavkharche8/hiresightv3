import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, DollarSign, Briefcase, Wrench, Users, MapPin } from 'lucide-react';

interface JobRole {
  title: string;
  count: number;
}

interface Skill {
  skill: string;
  importance: 'High' | 'Medium' | 'Low';
}

interface SalaryRanges {
  min: number;
  avg: number;
  max: number;
  currency: string;
}

interface GrowthOutlook {
  trend: 'Growing' | 'Stable' | 'Declining';
  description: string;
}

interface CareerInsights {
  growthOutlook: GrowthOutlook;
  salaryRanges: SalaryRanges;
  jobRoles: JobRole[];
  technicalSkills: Skill[];
  softSkills: Skill[];
  topLocations: string[];
  marketDemand: string;
}

export const JobScraper = () => {
  const [careerField, setCareerField] = useState('');
  const [location, setLocation] = useState('India');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<CareerInsights | null>(null);
  const { toast } = useToast();

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImportanceBadgeColor = (importance: string) => {
    switch (importance) {
      case 'High':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!careerField) {
      toast({
        title: "Error",
        description: "Please enter a career field",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setInsights(null);

    try {
      const response = await fetch('/api/analyze-career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ careerField, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze career field');
      }

      if (data?.insights) {
        setInsights(data.insights);
        toast({
          title: "Success",
          description: "Career insights generated successfully",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze career field",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedFields = [
    'Data Analyst',
    'Software Developer',
    'Digital Marketing',
    'UI/UX Designer',
    'Product Manager',
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Career Insights Analyzer</CardTitle>
          <CardDescription>
            Get job market insights using ML and real-time data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="careerField" className="text-sm font-medium">
                  Career Field
                </label>
                <Input
                  id="careerField"
                  type="text"
                  value={careerField}
                  onChange={(e) => setCareerField(e.target.value)}
                  placeholder="e.g., Data Analyst, Doctor, Teacher"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="India"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground w-full">Popular fields:</span>
              {predefinedFields.map((field) => (
                <Button
                  key={field}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCareerField(field)}
                  disabled={isLoading}
                >
                  {field}
                </Button>
              ))}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with ML...
                </>
              ) : (
                ' Generate Insights'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {insights && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Career Insights: {careerField}</h3>
            <Button onClick={() => handleAnalyze({ preventDefault: () => {} } as React.FormEvent)} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {/* Growth Outlook */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Growth Outlook
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="text-base">
                {insights.growthOutlook.trend}
              </Badge>
              <p className="text-sm text-muted-foreground">{insights.growthOutlook.description}</p>
              <p className="text-sm mt-4">{insights.marketDemand}</p>
            </CardContent>
          </Card>

          {/* Salary Ranges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Salary Ranges (Annual)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Minimum</p>
                  <p className="text-lg font-semibold">{formatINR(insights.salaryRanges.min)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average</p>
                  <p className="text-lg font-semibold text-primary">{formatINR(insights.salaryRanges.avg)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Maximum</p>
                  <p className="text-lg font-semibold">{formatINR(insights.salaryRanges.max)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Common Job Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.jobRoles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="font-medium">{role.title}</span>
                    <Badge variant="outline">{role.count}+ openings</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Technical Skills Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.technicalSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={getImportanceBadgeColor(skill.importance)}
                  >
                    {skill.skill} • {skill.importance}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Soft Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Soft Skills Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.softSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={getImportanceBadgeColor(skill.importance)}
                  >
                    {skill.skill} • {skill.importance}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Top Hiring Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.topLocations.map((location, index) => (
                  <Badge key={index} variant="secondary" className="text-base">
                    {location}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
