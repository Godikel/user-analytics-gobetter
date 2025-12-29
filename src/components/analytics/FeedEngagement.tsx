import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

const feedStats = {
  totalPosts: 1247,
  totalEngagement: 45892,
  avgLikes: 32,
  avgComments: 8,
  topPosts: [
    {
      id: 1,
      title: "5 Tips for Better Remote Collaboration",
      likes: 234,
      comments: 45,
      shares: 28,
    },
    {
      id: 2,
      title: "New Course Launch: AI Fundamentals",
      likes: 189,
      comments: 67,
      shares: 34,
    },
    {
      id: 3,
      title: "Q4 Learning Goals Discussion",
      likes: 156,
      comments: 89,
      shares: 12,
    },
  ],
};

export function FeedEngagement() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "550ms" }}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-feeds" />
          Feed Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-feeds/10 border border-feeds/20">
            <p className="text-2xl font-bold text-feeds">
              {feedStats.totalPosts.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Posts</p>
          </div>
          <div className="p-4 rounded-lg bg-feeds/10 border border-feeds/20">
            <p className="text-2xl font-bold text-feeds">
              {feedStats.totalEngagement.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Engagement</p>
          </div>
        </div>

        <h4 className="text-sm font-medium mb-3">Top Performing Posts</h4>
        <div className="space-y-3">
          {feedStats.topPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-feeds/20 text-feeds font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-surveys" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-courses" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-live-classes" />
                    {post.shares}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
