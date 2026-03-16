import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CareerField } from '@/data/careerFields';
import { Bookmark, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldCardProps {
  field: CareerField;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export const FieldCard = ({ field, isBookmarked, onBookmarkToggle }: FieldCardProps) => {
  const IconComponent = Icons[field.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 border-border bg-gradient-card animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onBookmarkToggle();
            }}
            className={cn(
              "transition-colors",
              isBookmarked && "text-accent hover:text-accent/80"
            )}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </Button>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {field.name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {field.shortDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              "px-2 py-1 rounded-md text-xs font-medium",
              field.growthOutlook.trend === 'Growing' && "bg-primary/10 text-primary",
              field.growthOutlook.trend === 'Stable' && "bg-muted text-muted-foreground",
              field.growthOutlook.trend === 'Declining' && "bg-destructive/10 text-destructive"
            )}>
              {field.growthOutlook.trend} {field.growthOutlook.percentage}
            </span>
            <span className="text-muted-foreground">growth outlook</span>
          </div>
          <Button asChild className="w-full group/btn">
            <Link to={`/field/${field.id}`} className="flex items-center justify-center gap-2">
              Explore Career Path
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
