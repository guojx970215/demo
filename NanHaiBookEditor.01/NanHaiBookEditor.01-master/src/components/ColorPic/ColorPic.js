import React from 'react' 
import SvgImg from '../HomeMenu/PhotoGallery/SvgImg';

class ColorPic extends React.Component {
  ifSvgImg = (url) =>{
    if (url && url.substring(url.length, url.lastIndexOf('.')) === '.svg') {
      return true;
    }
    return false;
  }
  render() {
    const {item} = this.props
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: `${(100 - item.metadata.imgOpacity) / 100}`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          borderStyle: item.metadata.borderStyle,
          borderWidth: item.metadata.borderWidth + 'px',
          borderRadius: item.metadata.borderRadius + 'px',
          borderColor: item.metadata.borderColor, 
          boxShadow: item.metadata.shadowType === '1'
            ? item.metadata.boxShadowText
            : item.metadata.boxHShadow +
            'px ' +
            item.metadata.boxVShadow +
            'px ' +
            item.metadata.boxBlur +
            'px ' +
            item.metadata.boxSpread +
            'px ' +
            item.metadata.boxColor +
            ' ' +
            (item.metadata.boxInset === 'inset'
              ? 'inset'
              : ''),
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            transform: (item.metadata.rotateY
              ? 'rotateY(180deg)'
              : '') + (item.metadata.rotateX
                ? 'rotateX(180deg)'
                : '')
          }}
        >
          {this.ifSvgImg(item.url) ? (
            <SvgImg
              url={item.url}
              defaultColors={item.metadata.defaultSvgColors}
              style={{
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            ></SvgImg>
          ) : (
              <img
                src={item.url}
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  height: '100%',
                  maxHeight: '100%'
                }}
              />
            )}
        </div>
      </div>
    
    )
  }
}

export default ColorPic