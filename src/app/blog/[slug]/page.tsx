import BlogPostPage from '@/components/pages/BlogPost'
import { blogPosts } from '@/data/blogPosts'

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export default function Page() { return <BlogPostPage /> }
