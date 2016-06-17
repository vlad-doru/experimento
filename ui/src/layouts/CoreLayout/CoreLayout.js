import React from 'react'
import Header from '../../components/Header'
import classes from './CoreLayout.scss'
import Paper from 'material-ui/Paper';
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div className='text-center' style={{height: '100%'}}>
    <Header />
    <div className="container" style={{height: '100%'}}>
      <Paper rounded={true} style={{
        paddingTop: 20,
        minHeight: "90%",
      }}>
      <div style={{
        marginTop: 50,
      }}>
        <hr style={{width: '90%', borderWidth: 2}}/>
        {children}
      </div>
      </Paper>
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
