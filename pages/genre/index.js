import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

const Genre = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticProps({ locale }) {
  const from = 'genre-props'
  const props = await fetchGlobalAllData({ from, locale })
  
  const allGenres = new Set()
  props.allPages?.forEach(page => {
    if (page.genre && Array.isArray(page.genre)) {
      page.genre.forEach(g => allGenres.add(g))
    }
  })
  
  props.allGenres = Array.from(allGenres)
  delete props.allPages
  return {
    props,
    revalidate: siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}

export default Genre
