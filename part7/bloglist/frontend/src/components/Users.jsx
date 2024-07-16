import { useSelector } from 'react-redux'
import {
  Link
} from 'react-router-dom'

const Users = () => {

  const users = useSelector(state => state.userList)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map((user) => {
            const userLink = `/users/${user.id}`
            return (
              <tr key={user.id}>
                <td>
                  <Link to={userLink}>
                    {user.name}
                  </Link>

                </td>
                <td>{user.blogs.length}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Users