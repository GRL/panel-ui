// Configures Jest, the testing engine
// -- Sets test environment, module resolution, and TS integration via ts-jest.
// -- Must align with tsconfig.json and sometimes vite.config.mts.
// -- Must match paths and module resolution from tsconfig.json.
// -- Uses ts-jest to compile TS like Vite does.

export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};