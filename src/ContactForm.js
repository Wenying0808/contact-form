import React from 'react'
import './ContactForm.css'

class ContactForm extends React.Component{
  constructor(props) {
    super(props);

    this.state={
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      formErrors: {
        name: false,
        email: false,
        subject: false,
        message: false
      },
      result:'',
      isLoading: false
    };

    this.handleNameChange = this.handleInputChange.bind(this, "name");
    this.handleEmailChange = this.handleInputChange.bind(this, "email");
    this.handleSubjectChange = this.handleInputChange.bind(this, "subject");
    this.handleMessageChange = this.handleInputChange.bind(this, "message");
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isFormValid(){
    const formData = this.state.formData;
    const formErrors = this.state.formErrors;
    //check if all form inputs are filled and valid, then return true

    return(
      formData.name !== '' &&
      formData.email !== '' &&
      formData.subject !== '' &&
      formData.message !== '' &&
      !formErrors.name &&
      !formErrors.email &&
      !formErrors.subject &&
      !formErrors.message
    );
  }

  handleInputChange(fieldName, event){
    let error =false;
    if(fieldName === "email"){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error= !emailRegex.test(event.target.value);
    }else{
      error = event.target.value === '';
    }

    this.setState({
      formData:{...this.state.formData, [fieldName]:event.target.value},
      formErrors:{...this.state.formErrors, [fieldName]: error}
    });
  }

  handleSubmit = async(event) => {
    event.preventDefault();

    this.setState({
      result:"",
      isLoading: true
    });

    const formData = new FormData(event.target);

    formData.append('name', this.state.formData.name);
    formData.append('email', this.state.formData.email);
    formData.append('subject', this.state.formData.subject);
    formData.append('message', this.state.formData.message);
    formData.append('access_key', '36b63f36-0f0e-4ad4-ad8b-2464172289fb');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Success', data);
        this.setState({ result: data.message });
        
        // Set a timeout to clear the result message after 10 seconds
        setTimeout(() => {
          this.setState({ result: '' });
        }, 10000);

      } else {
        console.error('Error:', res);
        this.setState({ result: 'Error occurred during submission.' });
      }
    } catch (error) {
      console.error('Error:', error);
      this.setState({ result: 'Error occurred during submission.' });

    } finally {
      // Set isLoading to false after submission (whether successful or not)
      this.setState({ isLoading: false });
    }

  }

  render(){
    return (
      <div className="contactForm">
        <h1>Send Wenying a message</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="hidden" name="access_key" value="36b63f36-0f0e-4ad4-ad8b-2464172289fb"></input>

          <input type="text" id="name" placeholder='Your name' value={this.state.formData.name} onChange={this.handleNameChange} required ></input>
          
          <input  type="email" id="email" placeholder='Your email' value={this.state.formData.email} onChange={this.handleEmailChange} required></input>
          <input type="text" id="subject" placeholder='Subject' value={this.state.formData.subject} onChange={this.handleSubjectChange} required></input>
          <textarea placeholder='Your message' value={this.state.formData.message} onChange={this.handleMessageChange} required></textarea>
          <button type="submit" disabled={!this.isFormValid() || this.state.isLoading}>{this.state.isLoading ? "Sending..." : "Send" }</button>
          <span>{this.state.result}</span>
        </form>
        
        
      </div>
      );
  }
  
}

export default ContactForm;