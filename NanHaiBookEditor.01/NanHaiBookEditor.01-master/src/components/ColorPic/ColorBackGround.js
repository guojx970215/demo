import React from 'react'

class ColorPic extends React.Component {
  render() {
    let { item ,style={}} = this.props
    if (typeof (item.metadata) === 'string') {
      item.metadata = JSON.parse(item.metadata)
    }
    const {
      borderWidth = 0,
      imgOpacity = 0,
      borderColor = '#000000',
      borderStyle = 'solid',
      boxColor = '#000000',
      boxHShadow = 0,
      boxVShadow = 0,
      boxBlur = 0,
      boxSpread = 0,
      boxInset = 'inset',
      shadowType = '1',
      boxShadowText = '',
      borderRadius = 0,
      rotateY = false,
      rotateX = false,
    } = item.metadata || {}
    return (
      <div
        style={{
          position:'relative',
          width: '100%',
          height: '100%',
          opacity: `${(100 - imgOpacity) / 100}`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          transform: rotateX
            ? 'rotateX(180deg)'
            : '',
            ...style
        }}
      >
        <div
          style={{
            borderStyle: borderStyle,
            borderWidth: borderWidth + 'px',
            borderRadius: borderRadius + 'px',
            borderColor: borderColor,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            transform: rotateY
              ? 'rotateY(180deg)'
              : ''
          }}
        >
          <div
            style={{
              maxWidth: '100%',
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              backgroundImage: `url(${item.url})`,
              backgroundSize: item.backgroundSize,
              backgroundRepeat: item.backgroundRepeat,
              opacity:item.opacity
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            boxShadow:
              shadowType === '1'
                ? boxShadowText
                : boxHShadow +
                'px ' +
                boxVShadow +
                'px ' +
                boxBlur +
                'px ' +
                boxSpread +
                'px ' +
                boxColor +
                ' ' +
                (boxInset === 'inset'
                  ? 'inset'
                  : ''),
            transform: rotateY
              ? 'rotateY(180deg)'
              : ''
          }}
        ></div>
      </div>

    )
  }
}

export default ColorPic