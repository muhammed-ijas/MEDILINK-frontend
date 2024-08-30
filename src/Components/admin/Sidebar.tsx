import { NavLink } from "react-router-dom";
import { FcAreaChart } from "react-icons/fc";
import { FcAbout } from "react-icons/fc";

function sideBar() {
  const activeStyle = {
    backgroundColor: "#0F1015",
    color: "white ",
  };

  return (
    <div className="mt-20">
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div
          className="h-full px-3 py-4 overflow-y-auto bg-black "
          style={{ marginTop: "72px" }}
        >
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/admin/dashboard"
                className="flex items-center p-2 text-gray-100 rounded-lg  hover:bg-gray-900 hover:text-white  group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <FcAreaChart />
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className="flex items-center p-2  text-gray-100 rounded-lg  hover:bg-gray-900 hover:text-white   group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5  text-gray-100 rounded-lg  hover:bg-gray-900 hover:text-white  "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Users list
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/requests"
                className="flex items-center p-2  text-gray-100 rounded-lg  hover:bg-gray-900 hover:text-white   group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <FcAbout />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Requests
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/services"
                className="flex items-center p-2  text-gray-100 rounded-lg  hover:bg-gray-900 hover:text-white   group"
                style={({ isActive }) => (isActive ? activeStyle : undefined)}
              >
                <svg
                  className="flex-shrink-0 w-5 h-5  text-gray-100 rounded-lg  hover:bg-gray-900 hover:text-white  "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Service list
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default sideBar;
