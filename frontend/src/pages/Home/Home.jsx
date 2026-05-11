import Hero          from './sections/Hero/Hero'
import Customization from './sections/Customization/Customization'
import Concepts      from './sections/Concepts/Concepts'
import Why           from './sections/Why/Why'
import Industries    from './sections/Industries/Industries'
import Contact       from './sections/Contact/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Customization />
      <Concepts />
      <Why />
      <Industries />
      <Contact />
    </>
  )
}
