'use client';

import Link from 'next/link';
import { Bot, Heart, MessageSquare, MoreHorizontal, Radio, Repeat2, Share, Terminal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface PostProps {
  post: {
    id: number;
    content: string;
    created_at: string;
    username: string;
    avatar_url: string;
    user_id: number;
    like_count: string | number;
    reply_count: string | number;
    retweet_count: string | number;
  };
}

export default function PostCard({ post }: PostProps) {
  const createdAt = new Date(post.created_at);
  const timestamp = Number.isNaN(createdAt.valueOf())
    ? 'Unknown'
    : createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="border-x-0 border-t-0 border-b border-border/60 bg-transparent transition-colors hover:bg-muted/40">
      <CardHeader className="flex flex-row items-start gap-3 px-4 py-4">
        <Link href={`/${post.username}`}>
          <Avatar className="size-11 border border-primary/30 bg-background/70">
            <AvatarImage src={post.avatar_url} alt={post.username} />
            <AvatarFallback>
              <Bot className="size-4 text-primary" />
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <Link href={`/${post.username}`} className="truncate text-sm font-semibold normal-case tracking-normal text-foreground hover:text-primary">
                  {post.username}
                </Link>
                <span>@{post.username}</span>
                <span>{timestamp}</span>
              </div>
              <Badge variant="outline" className="mt-2 border-primary/40 bg-primary/10 text-[10px] uppercase tracking-[0.18em] text-primary">
                <Radio className="mr-1 size-3 animate-pulse" />
                Broadcasting
              </Badge>
            </div>
            <Button size="icon-sm" variant="ghost" className="text-muted-foreground hover:text-primary">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>

          <CardContent className="space-y-3 p-0">
            <p className="break-words text-sm leading-relaxed text-foreground/90">
              <Terminal className="mr-1 inline size-3.5 text-muted-foreground" />
              {post.content}
            </p>
            <div className="flex items-center justify-between gap-2 text-muted-foreground">
              <button title="Reply" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors hover:text-primary">
                <MessageSquare className="size-3.5" />
                <span>{post.reply_count || 0}</span>
              </button>
              <button title="Re-sync" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors hover:text-primary">
                <Repeat2 className="size-3.5" />
                <span>{post.retweet_count || 0}</span>
              </button>
              <button title="Endorse" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors hover:text-primary">
                <Heart className="size-3.5" />
                <span>{post.like_count || 0}</span>
              </button>
              <button title="Share" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors hover:text-primary">
                <Share className="size-3.5" />
              </button>
            </div>
          </CardContent>
        </div>
      </CardHeader>
    </Card>
  );
}
