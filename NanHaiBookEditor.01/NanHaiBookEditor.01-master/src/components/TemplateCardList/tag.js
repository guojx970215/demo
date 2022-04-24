import React from 'react'
import { Icon, Input, Tag, Tooltip } from 'antd'
import api from '../../api/bookApi';
const { CheckableTag } = Tag;

class Tags extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
    tagsFromServer: [],
    selectedTags: []
  }

  componentDidMount(){
    
    let { type } = this.props;
    if (type === 'isPageTemplate') {
      api
        .getPageTemplateTags()
        .then((result) => {
          console.log('tags', result)
          this.setState({
            tagsFromServer: result,
            selectedTags: []
          })
        })
    } else if (type === 'isElementTemplate') {
      api
        .getElementTags()
        .then((result) => {
          console.log('tags', result)
          this.setState({
            tagsFromServer: result,
            selectedTags: []
          })
        })
    }
  }

  handleClose = removedTag => {
    const tags = this.props.value.filter(tag => tag !== removedTag)
    this.setState({
      selectedTags: this.state.selectedTags.filter(tag => tag !== removedTag)
    })
    this.onChange(tags)
  }

  showInput = () => {
    this.setState({inputVisible: true}, () => this.input.focus())
  }

  handleInputChange = e => {
    this.setState({inputValue: e.target.value})
  }
  handleInputConfirm = () => {
    const {inputValue} = this.state
    let {value = []} = this.props
    let tags = []
    if (inputValue && value.indexOf(inputValue) === -1) {
      tags = [...value, inputValue]
    } else {
      tags = [...value]
    }
    this.onChange(tags)
    this.setState({
      inputVisible: false,
      inputValue: ''
    })
  }
  selectTagsExsit = (tag, checked)=>{
    const { selectedTags } = this.state;
    let {value} = this.props
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    if(selectedTags){
      selectedTags.forEach(item=>{
        value = value.filter(tag => tag !== item)
      })
    }
    if(!value){
      value = []
    }
    const tags = value.concat(nextSelectedTags)
    this.onChange(tags)
    this.setState({ selectedTags: nextSelectedTags })
  }

  onChange (tags) {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(tags)
    }
  }

  saveInputRef = input => (this.input = input)

  render () {
    const { inputVisible, inputValue, tagsFromServer, selectedTags} = this.state
    const {trans, value = []} = this.props
    return (
      <div>
        {value.map((tag, index) => {
          const isLongTag = tag.length > 20
          const tagElem = (
            <Tag key={tag} closable={index !== -1} onClose={() => this.handleClose(tag)}
              style={{
                marginBottom: '4px'
              }}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          )
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          )
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{width: 78}}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
            <Icon type="plus"/> addTag
          </Tag>
        )}
        <div style={{
          marginTop: '10px',
          backgroundColor:'#eeeeee',
          padding:'4px 10px'
        }}>
          {tagsFromServer.map(tag => (
          <CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => this.selectTagsExsit(tag, checked)}
          >
            {tag}
          </CheckableTag>
        ))}
        </div>
      </div>
    )
  }
}

//
// let mapStateToProps = ({trans, bookPages}) => ({
//   trans,
//   bookPages
// })
// export default connect(
//   mapStateToProps
// )(Tags)
export default Tags
