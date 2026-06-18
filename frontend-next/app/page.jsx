import Hero          from '../components/sections/Hero/Hero'
import Customization from '../components/sections/Customization/Customization'
import Concepts      from '../components/sections/Concepts/Concepts'
import Why           from '../components/sections/Why/Why'
import Industries    from '../components/sections/Industries/Industries'
import Legal         from '../components/sections/Legal/Legal'
import Reviews       from '../components/sections/Reviews/Reviews'

export default function Home() {
  return (
    <>
      <Hero />
      <Customization />
      <Concepts />
      <Why />
      <Industries />
      {/* <Contact /> */}
      <Legal />
      <Reviews />
    </>
  )
}
