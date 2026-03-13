import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

const GenreDetail = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ params: { genre }, locale }) {
  const from = 'genre-detail-props'
  const props = await fetchGlobalAllData({ from, locale })

  props.posts = props.allPages
    ?.filter(page => page.type === 'Post' && page.status === 'Published')
    .filter(post => post && post?.genre && post?.genre.includes(genre))

  props.postCount = props.posts.length
  props.genre = genre
  delete props.allPages
  
  return {
    props,
    revalidate: siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}

export async function getStaticPaths() {
  const from = 'genre-static-path'
  const { allPages } = await fetchGlobalAllData({ from })
  
  const allGenres = new Set()
  allPages?.forEach(page => {
    if (page.genre && Array.isArray(page.genre)) {
      page.genre.forEach(g => allGenres.add(g))
    }
  })
  
  return {
    paths: Array.from(allGenres).map(genre => ({ params: { genre } })),
    fallback: true
  }
}

export default GenreDetail
