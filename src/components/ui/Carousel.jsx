import { Children } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Carousel = ({ children, slidesToShow = 3 }) => {
  const slides = Children.toArray(children)

  if (!slides.length) {
    return null
  }

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 10000,
    cssEase: 'linear',
    pauseOnHover: false,
    pauseOnFocus: false,
    swipe: false,
    draggable: false,
    slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, slides.length),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <Slider {...settings}>
      {slides.map((slide, index) => (
        <div key={slide.key ?? index} className="px-4">
          {slide}
        </div>
      ))}
    </Slider>
  )
}

export default Carousel