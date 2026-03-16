import { Navigation } from '@/components/Navigation';
import { FieldCard } from '@/components/FieldCard';
import { careerFields } from '@/data/careerFields';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookmarkX } from 'lucide-react';

const Bookmarks = () => {
  const { bookmarkedIds, toggleBookmark, isBookmarked } = useBookmarks();

  const bookmarkedFields = careerFields.filter(field => 
    bookmarkedIds.includes(field.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Saved Career Fields
            </h1>
            <p className="text-lg text-muted-foreground">
              Your bookmarked fields for quick access
            </p>
          </div>

          {bookmarkedFields.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {bookmarkedFields.map((field) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    isBookmarked={isBookmarked(field.id)}
                    onBookmarkToggle={() => toggleBookmark(field.id)}
                  />
                ))}
              </div>
              
              {bookmarkedFields.length >= 2 && (
                <div className="text-center">
                  <Button asChild size="lg">
                    <Link to={`/compare?fields=${bookmarkedFields.map(f => f.id).join(',')}`}>
                      Compare All Saved Fields
                    </Link>
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <BookmarkX className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No Saved Fields Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start exploring and bookmark fields that interest you
              </p>
              <Button asChild>
                <Link to="/fields">Explore Career Fields</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
