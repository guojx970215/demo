import React from "react";
import { Form, Input,  message } from 'antd'
import PropTypes from 'prop-types';
import Tags from '../../TemplateCardList/tag'
import "./ElementTemplateForm.css";
class ElementTemplateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateName: '',
      tags:[],
      allTags: [],
      addTags: []
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.tagsChange = this.tagsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    this.setState({templateName: event.target.value});
  }
  handleSubmit(event) {
    this.props.onSave(this.state)
    event.preventDefault();
  }
  tagsChange(tags) {
    this.setState({
      tags: tags
    })
  }

  render() {
    const { tags } = this.state
    return (
      <div className="conFormContainer">
        <form className="conForm" onSubmit={this.handleSubmit}>
        <label className="ElementTemplateFormLabel">
          <span className="name">模板名称:</span>
          <input className="common-input" onChange={this.handleChangeName}/>
        </label>
        <label  className="ElementTemplateFormLabel">
          <span className="name">标签:</span>
          <Tags
            type='isElementTemplate'
            className="common-input"
            value={tags}
            onChange={this.tagsChange}></Tags>
        </label>
        <div className="leaflet-button leaflet-confirm" onClick={this.handleSubmit}>保存</div>
        <div className="leaflet-button leaflet-cancel" onClick={this.props.closeDialog}>取消</div>
      </form>
      </div>
    );
  }
}
ElementTemplateForm.propTypes={
  onSave:PropTypes.func.isRequired,
  closeDialog:PropTypes.func.isRequired
}
export default ElementTemplateForm;