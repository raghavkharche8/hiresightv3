import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { careerFields } from '@/data/careerFields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TrendingUp, DollarSign, BookOpen, Lightbulb, Bookmark } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';
import { AIInsights } from '@/components/AIInsights';

const FieldDetail = () => {
  const { fieldId } = useParams();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const field = careerFields.find(f => f.id === fieldId);

  if (!field) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Field not found</h1>
          <Button asChild>
            <Link to="/fields">Back to Fields</Link>
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = Icons[field.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/fields" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Fields
              </Link>
            </Button>

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-primary/10">
                  {IconComponent && <IconComponent className="h-10 w-10 text-primary" />}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                    {field.name}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {field.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleBookmark(field.id)}
                className={cn(isBookmarked(field.id) && "text-accent border-accent")}
              >
                <Bookmark className={cn("h-5 w-5", isBookmarked(field.id) && "fill-current")} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="curated" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="curated">Curated Data</TabsTrigger>
              <TabsTrigger value="ai">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="curated" className="space-y-6 mt-6">
              {/* Growth Outlook Card */}
              <Card className="border-primary/20 bg-gradient-card shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Growth Outlook</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={cn(
                      "text-sm",
                      field.growthOutlook.trend === 'Growing' && "bg-primary text-primary-foreground",
                      field.growthOutlook.trend === 'Stable' && "bg-muted text-foreground",
                      field.growthOutlook.trend === 'Declining' && "bg-destructive text-destructive-foreground"
                    )}>
                      {field.growthOutlook.trend}
                    </Badge>
                    <span className="text-2xl font-bold text-foreground">
                      {field.growthOutlook.percentage}
                    </span>
                    <span className="text-muted-foreground">projected growth</span>
                  </div>
                  <p className="text-muted-foreground">{field.growthOutlook.description}</p>
                </CardContent>
              </Card>

              {/* Salary Ranges */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Salary Ranges</CardTitle>
                  </div>
                  <CardDescription>Average annual salaries by experience level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Entry Level</div>
                      <div className="text-xl font-bold text-foreground">{field.salaryRanges.entry}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Mid Level</div>
                      <div className="text-xl font-bold text-foreground">{field.salaryRanges.mid}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">Senior Level</div>
                      <div className="text-xl font-bold text-foreground">{field.salaryRanges.senior}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Roles */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Common Job Roles</CardTitle>
                  </div>
                  <CardDescription>Explore different positions in this field</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {field.jobRoles.map((role, index) => (
                      <AccordionItem key={index} value={`role-${index}`}>
                        <AccordionTrigger className="hover:text-primary">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">{role.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {role.experienceLevel}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{role.description}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Skills Required */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Skills You'll Need</CardTitle>
                  </div>
                  <CardDescription>Essential technical and soft skills for success</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {field.skills.technical.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {field.skills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild variant="outline" size="lg" className="flex-1 group hover:border-primary">
                  <Link to="/compare" className="flex items-center justify-center gap-2">
                    Compare with Other Fields
                  </Link>
                </Button>
                <Button asChild size="lg" className="flex-1">
                  <Link to="/fields">Explore More Fields</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <AIInsights careerField={field.name} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
