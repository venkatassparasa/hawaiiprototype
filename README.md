## Hawaii Compliance Dashboard

This project is a React + Vite–based frontend plus a Node.js/Express backend and supporting services (MongoDB, Redis, Temporal, Azurite, Nginx) for the Hawaii compliance dashboard.

### Local development with Docker Desktop

For a full local stack (frontend, backend, Temporal, databases, and tools) using Docker Desktop, see `LOCAL_DOCKER_SETUP.md`.

### Frontend tooling

The frontend uses the standard Vite React tooling:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) (Babel/oxc) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) (SWC) as an alternative.

The React Compiler is not enabled by default because of its impact on dev and build performance. To add it, see the [official documentation](https://react.dev/learn/react-compiler/installation).

