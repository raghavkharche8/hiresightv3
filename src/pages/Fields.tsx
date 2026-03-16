import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { FieldCard } from '@/components/FieldCard';
import { careerFields } from '@/data/careerFields';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Fields = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const filteredFields = careerFields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Explore Career Fields
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover detailed insights about different career paths
            </p>
            
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search career fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                isBookmarked={isBookmarked(field.id)}
                onBookmarkToggle={() => toggleBookmark(field.id)}
              />
            ))}
          </div>

          {filteredFields.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No fields found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fields;
