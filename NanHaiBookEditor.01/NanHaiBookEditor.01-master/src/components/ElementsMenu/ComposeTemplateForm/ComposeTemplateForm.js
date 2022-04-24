import React from "react";
import PropTypes from 'prop-types';
import "./ComposeTemplateForm.css";
class ComposeTemplateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateName: '',
      tags:[]
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeTags = this.handleChangeTags.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    this.setState({templateName: event.target.value});
  }
  handleChangeTags(event) {
    this.setState({tags: event.target.value});
  }

  handleSubmit(event) {
    this.props.onSave(this.state)
    event.preventDefault();
  }

  render() {
    return (
      <div className="conFormContainer">
        <form className="conForm" onSubmit={this.handleSubmit}>
        <label className="conFormLabel">
          模板名称:
          <input className="common-input" onChange={this.handleChangeName}/>
        </label>
        <label  className="conFormLabel">
          标签:
          <input className="common-input" placeholder="多个标签请用空格分开" onChange={this.handleChangeTags}/>
        </label>
        <div className="leaflet-button leaflet-confirm" onClick={this.handleSubmit}>保存</div>
        <div className="leaflet-button leaflet-cancel" onClick={this.props.closeDialog}>取消</div>
      </form>
      </div>
    );
  }
}
ComposeTemplateForm.propTypes={
  onSave:PropTypes.func.isRequired,
  closeDialog:PropTypes.func.isRequired
}
export default ComposeTemplateForm;