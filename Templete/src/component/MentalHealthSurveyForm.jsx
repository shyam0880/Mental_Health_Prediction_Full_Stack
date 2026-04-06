import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const options = {
  Gender:['Male','Female','other'],
  self_employed: ['', 'Yes', 'No'],
  family_history: ['No', 'Yes'],
  treatment: ['Yes', 'No'],
  work_interfere: ['Often', 'Rarely', 'Never', 'Sometimes', ''],
  no_employees: ['6-25', 'More than 1000', '26-100', '100-500', '1-5', '500-1000'],
  remote_work: ['No', 'Yes'],
  tech_company: ['Yes', 'No'],
  benefits: ['Yes', "Don't know", 'No'],
  care_options: ['Not sure', 'No', 'Yes'],
  wellness_program: ['No', "Don't know", 'Yes'],
  seek_help: ['Yes', "Don't know", 'No'],
  anonymity: ['Yes', "Don't know", 'No'],
  leave: ['Somewhat easy', "Don't know", 'Somewhat difficult', 'Very difficult', 'Very easy'],
  mental_health_consequence: ['No', 'Maybe', 'Yes'],
  phys_health_consequence: ['No', 'Yes', 'Maybe'],
  coworkers: ['Some of them', 'No', 'Yes'],
  supervisor: ['Yes', 'No', 'Some of them'],
  mental_health_interview: ['No', 'Yes', 'Maybe'],
  phys_health_interview: ['Maybe', 'No', 'Yes'],
  mental_vs_physical: ['Yes', "Don't know", 'No'],
  obs_consequence: ['No', 'Yes']
};

const validationSchema = Yup.object().shape({
  Age: Yup.number()
    .required('Age is required')
    .min(1, 'Too young')
    .max(120, 'Too old'),
  Gender: Yup.string().required('Gender is required'),
  Country: Yup.string().required('Country is required'),
  state: Yup.string().required('State is required'),
  self_employed: Yup.string().required('Please select an option'),
  family_history: Yup.string().required('Please select an option'),
  treatment: Yup.string().required('This field is required'),
  work_interfere: Yup.string().required('Please select an option'),
  no_employees: Yup.string().required('Please select an option'),
  remote_work: Yup.string().required('Please select an option'),
  tech_company: Yup.string().required('Please select an option'),
  benefits: Yup.string().required('Please select an option'),
  care_options: Yup.string().required('Please select an option'),
  wellness_program: Yup.string().required('Please select an option'),
  seek_help: Yup.string().required('Please select an option'),
  anonymity: Yup.string().required('Please select an option'),
  leave: Yup.string().required('Please select an option'),
  mental_health_consequence: Yup.string().required('Please select an option'),

});

const MentalHealthSurveyFormik = () => {
  const initialValues = {
    Timestamp: new Date().toISOString(),
    Age: '',
    Country: '',
    state: '',
    Gender: '',
    self_employed: '',
    family_history: '',
    treatment: '',
    work_interfere: '',
    no_employees: '',
    remote_work: '',
    tech_company: '',
    benefits: '',
    care_options: '',
    wellness_program: '',
    seek_help: '',
    anonymity: '',
    leave: '',
    mental_health_consequence: '',
    phys_health_consequence: '',
    coworkers: '',
    supervisor: '',
    mental_health_interview: '',
    phys_health_interview: '',
    mental_vs_physical: '',
    obs_consequence: '',
    comments: ''
  };

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className='form'>
        {Object.keys(initialValues).filter(field => field !== 'Timestamp').map((field) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label htmlFor={field} style={{ display: 'block', fontWeight: 'bold' }}>
              {field}
            </label>

            {options[field] ? (
                <Field as="select" name={field}>
                  <option value="">{'Select...'}</option>
                  {options[field].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Field>
              ) : (
                <Field type="text" name={field} placeholder={`Enter ${field}`} />
              )}

            <ErrorMessage
              name={field}
              component="div"
              style={{ color: 'red', fontSize: '0.8em' }}
            />
          </div>
        ))}
        <button type="submit" className="sticky-submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default MentalHealthSurveyFormik;
