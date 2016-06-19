import React from 'react'
import Header from '../../components/Header'
import classes from './CoreLayout.scss'
import Paper from 'material-ui/Paper';
import {blue500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div className='text-center' style={{height: '100%'}}>
    <Header />
    <div className="container" style={{height: '100%'}}>
      <Paper rounded={true} style={{
        paddingTop: 20,
        minHeight: "90%",
        maxWidth: 800,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
      <div style={{
        marginTop: 50,
      }}>
        <hr style={{width: '90%', border: "1px solid rgba(0, 0, 0, 0.15)"}}/>
        <div style={{
            paddingLeft: 25,
            paddingRight: 25,
          }}>
          {children}
        </div>
      </div>
      </Paper>
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
