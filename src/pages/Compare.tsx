import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { careerFields, CareerField } from '@/data/careerFields';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, DollarSign, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const Compare = () => {
  const [searchParams] = useSearchParams();
  const initialFieldIds = searchParams.get('fields')?.split(',').filter(Boolean) || [];
  
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(
    initialFieldIds.slice(0, 3)
  );

  const selectedFields = selectedFieldIds
    .map(id => careerFields.find(f => f.id === id))
    .filter((f): f is CareerField => f !== undefined);

  const handleFieldChange = (index: number, fieldId: string) => {
    const newIds = [...selectedFieldIds];
    newIds[index] = fieldId;
    setSelectedFieldIds(newIds);
  };

  const addField = () => {
    if (selectedFieldIds.length < 3) {
      const availableField = careerFields.find(
        f => !selectedFieldIds.includes(f.id)
      );
      if (availableField) {
        setSelectedFieldIds([...selectedFieldIds, availableField.id]);
      }
    }
  };

  const removeField = (index: number) => {
    setSelectedFieldIds(selectedFieldIds.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/fields" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Fields
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Compare Career Fields
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Side-by-side comparison to help you make informed decisions
            </p>

            <div className="flex flex-wrap gap-3">
              {selectedFieldIds.map((fieldId, index) => (
                <Select
                  key={index}
                  value={fieldId}
                  onValueChange={(value) => handleFieldChange(index, value)}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {careerFields.map((field) => (
                      <SelectItem 
                        key={field.id} 
                        value={field.id}
                        disabled={selectedFieldIds.includes(field.id) && field.id !== fieldId}
                      >
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
              
              {selectedFieldIds.length < 3 && (
                <Button variant="outline" onClick={addField}>
                  + Add Field
                </Button>
              )}
            </div>
          </div>

          {selectedFields.length < 2 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Select at least 2 fields to compare
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Growth Outlook Comparison */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Growth Outlook</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedFields.length}, 1fr)` }}>
                    {selectedFields.map((field) => (
                      <div key={field.id} className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold text-foreground mb-3">{field.name}</h4>
                        <Badge className={cn(
                          "mb-2",
                          field.growthOutlook.trend === 'Growing' && "bg-primary text-primary-foreground",
                          field.growthOutlook.trend === 'Stable' && "bg-muted text-foreground",
                          field.growthOutlook.trend === 'Declining' && "bg-destructive text-destructive-foreground"
                        )}>
                          {field.growthOutlook.trend} {field.growthOutlook.percentage}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {field.growthOutlook.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Salary Comparison */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Salary Ranges</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedFields.length}, 1fr)` }}>
                    {selectedFields.map((field) => (
                      <div key={field.id} className="space-y-3">
                        <h4 className="font-semibold text-foreground">{field.name}</h4>
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg bg-muted/30">
                            <div className="text-xs text-muted-foreground mb-1">Entry</div>
                            <div className="font-semibold text-foreground">{field.salaryRanges.entry}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30">
                            <div className="text-xs text-muted-foreground mb-1">Mid</div>
                            <div className="font-semibold text-foreground">{field.salaryRanges.mid}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30">
                            <div className="text-xs text-muted-foreground mb-1">Senior</div>
                            <div className="font-semibold text-foreground">{field.salaryRanges.senior}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Comparison */}
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Required Skills</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedFields.length}, 1fr)` }}>
                    {selectedFields.map((field) => (
                      <div key={field.id} className="space-y-4">
                        <h4 className="font-semibold text-foreground">{field.name}</h4>
                        
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Technical</div>
                          <div className="flex flex-wrap gap-1">
                            {field.skills.technical.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Soft Skills</div>
                          <div className="flex flex-wrap gap-1">
                            {field.skills.soft.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                {selectedFields.map((field) => (
                  <Button key={field.id} asChild variant="outline">
                    <Link to={`/field/${field.id}`}>
                      View Full {field.name} Details
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
