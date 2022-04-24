import React from 'react';
import styles from './SvgImg.module.scss';
import nanoid from 'nanoid';

class SvgImg extends React.Component {
  state = {
    colors: [],
    originHtml: '',
  };
  componentDidMount() {
    const { defaultColors } = this.props;
    fetch(this.props.url)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        const nid = 's' + nanoid(8);
        const imgDom = document.createElement('div');
        imgDom.innerHTML = text;
        const svgDom = imgDom.getElementsByTagName('svg')[0];
        svgDom.setAttribute(
          'class',
          svgDom.getAttribute('class')
            ? svgDom.getAttribute('class') + ' ' + nid
            : nid
        );
        const styleTag = imgDom.getElementsByTagName('style');
        if (styleTag[0]) {
          let styles = styleTag[0].innerHTML;
          styles = styles.split('}');
          for (let i = 0; i < styles.length; i++) {
            if (i !== styles.length - 1) {
              styles[i] = styles[i].split('{');
              styles[i][0] = styles[i][0]
                .split(',')
                .map((selector) => `.${nid} ${selector}`)
                .join(',');
              styles[i] = styles[i].join('{');
            }
          }
          styleTag[0].innerHTML = styles.join('}');
        }
        text = imgDom.innerHTML;

        if (defaultColors && defaultColors.length > 0) {
          this.setState(
            {
              colors: defaultColors,
              originHtml: text,
            },
            this.rebuildSvg
          );
        } else {
          let hexs = text.match(
            /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3}|[0-9a-fA-F]{8})/g
          ); //
          // eslint-disable-next-line no-useless-escape
          let rgbs = text.match(
            /[rR][gG][Bb][Aa]?[(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[)]{1}/g
          );
          let arr = [];
          hexs && (arr = arr.concat(hexs));
          rgbs && (arr = arr.concat(rgbs));
          let colors = [];
          arr.forEach((item, index) => {
            colors.push({
              id: index,
              color: item,
              newColor: item,
            });
          });
          this.setState({
            colors: colors,
            originHtml: text,
          });
          if (this.props.svgImgColors) {
            this.props.svgImgColors(colors);
          }
          if (this.imgDom) {
            this.imgDom.innerHTML = text;
          }
        }
      });
  }
  distinct(arr) {
    let result = [];
    let obj = {};

    for (let i of arr) {
      if (!obj[i]) {
        result.push(i);
        obj[i] = 1;
      }
    }

    return result;
  }
  // 去除重复数组
  distinctRexAndRgb(hex, rgb) {
    let arr = rgb.concat(hex);
    let result = [];
    let obj = {};
    for (let i of arr) {
      if (i.indexOf('rgb') > 0 || i.indexOf('RGB') > 0) {
        if (!obj[this.changeRgbToHex(i)] && !obj[i]) {
          result.push(i);
          obj[i] = 1;
        }
      } else {
        if (!obj[i]) {
          result.push(i);
          obj[i] = 1;
        }
      }
    }
    return result;
  }
  changeRgbToHex(color) {
    if (color.indexOf('rgba') > 0 || color.indexOf('RGBA') > 0) {
      let rgb = color.split(',');
      let r = parseInt(rgb[0].split('(')[1]);
      let g = parseInt(rgb[1]);
      let b = parseInt(rgb[2]);
      let a = parseInt(rgb[3].split(')')[0]);

      let hex =
        '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

      return hex;
    } else {
      let rgb = color.split(',');
      let r = parseInt(rgb[0].split('(')[1]);
      let g = parseInt(rgb[1]);
      let b = parseInt(rgb[2].split(')')[0]);

      let hex =
        '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      return hex;
    }
  }
  changeAllSvgColor(colors) {
    this.setState(
      {
        colors: colors,
      },
      this.rebuildSvg
    );
  }
  changeSvgColor(color, id) {
    const { colors } = this.state;
    colors.forEach((item) => {
      if (id === item.id) {
        item.newColor = color;
      }
    });
    this.setState(
      {
        colors: colors,
      },
      this.rebuildSvg
    );
  }
  rebuildSvg() {
    const { colors } = this.state;
    let originHtml = this.state.originHtml;
    colors.forEach((item) => {
      originHtml = originHtml.replace(item.color, item.newColor);
    });
    this.imgDom.innerHTML = originHtml;
  }
  render() {
    return (
      <div
        ref={(el) => {
          this.imgDom = el;
        }}
        className={styles.svgImgDiv}
        style={this.props.style}
        id={this.state.nid}
      ></div>
    );
  }
}

export default SvgImg;
