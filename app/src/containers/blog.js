import { drizzleConnect } from 'drizzle-react'
import Blog from '../components/Blog/';

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    Blog: state.contracts.Blog,
    accounts: state.accounts
  }
}

export default drizzleConnect(Blog, mapStateToProps);