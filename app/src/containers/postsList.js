import { drizzleConnect } from 'drizzle-react'
import PostsList from '../components/PostsList/';

const mapStateToProps = state => {
  return {
    drizzleStatus: state.drizzleStatus
  }
}

export default drizzleConnect(PostsList, mapStateToProps);