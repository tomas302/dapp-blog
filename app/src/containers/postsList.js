import { drizzleConnect } from 'drizzle-react'
import PostsList from '../components/PostsList/';

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus,
    Blog: state.contracts.Blog
  }
}

export default drizzleConnect(PostsList, mapStateToProps);