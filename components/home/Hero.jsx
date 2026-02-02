const Hero = () => {
  return (
    <div 
      className="world-wide-header" 
      data-world-wide-header="" 
      style={{backgroundImage: 'url("https://platinumlist.net/img/bg-worldwide-header3.webp")'}}
    >
      <div className="container2 padded world-wide-header__container">
        <div className="world-wide-header__content">
          <p className="world-wide-header__text">اكتشف</p>
          <div className="world-wide-header__list-container">
            <ul className="world-wide-header__list" data-world-wide-header-list="">
              <li 
                className="world-wide-header__list-item" 
                data-world-wide-header-list-item="" 
                style={{transform: 'translate(0px, -100px)'}}
              >
                أبرز الفعاليات
              </li>
              <li 
                className="world-wide-header__list-item" 
                data-world-wide-header-list-item="" 
                style={{transform: 'translate(0px, 0px)'}}
              >
                والمغامرات
              </li>
            </ul>
          </div>
          <p className="world-wide-header__text">أينما كنت!</p>
        </div>
      </div>
    </div>
  )
}

export default Hero