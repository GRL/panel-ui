# [Panel UI](https://github.com/GRL/panel-ui) &middot; [![license](https://cdn.generalresearch.com/buildStatus/icon?subject=license&status=MIT&color=blue)](./LICENSE) ![](https://github.com/facebook/react/blob/main/LICENSE) [![master](https://cdn.generalresearch.com/buildStatus/icon?subject=master&job=panel-ui%2Fmaster)](https://cdn.generalresearch.com/grl-panel.js) ![nodejs](https://cdn.generalresearch.com/buildStatus/icon?subject=node&status=20.19.2&color=blue) ![npm](https://cdn.generalresearch.com/buildStatus/icon?subject=npm&status=11.4.2&color=blue)

### General Research Supplier and Panel Interface

This project provides various front-end React components that leverage the General
Research [Full-Service Brokerage API](https://fsb.generalresearch.com/redoc/). There are no private API calls or
functionality.

## Integration Example

```js
<script
    src="https://cdn.generalresearch.com/grl-panel.js"
    //-- Essential:
    // -- This is your Product ID. Provided by General Research
    data-bpid="d0606a0b5d034a8d81b1e3579d1f76fd"

    // -- The ID of a div on the page that you would like to widget
    //      to be placed. Allows custom resizing and styling of the
    //      Panel UI widget
    data-target="div9f1dcb68"

    // -- The Brokerage Product User ID, a unique user 
    //      identifier. Should be a random uuid or hash 
    //      that is consistent for a user.
    data-bpuid="grl-panel-ui-example-c67bfe924d80"

    //-- User Interface Configuration
    data-panel="General Insights"
></script>
```

## Build Status and Content Delivery

<table>
 <tr>
    <td><strong>Branches</strong></td>
    <td><strong>Versions</strong></td>
 </tr>
 <tr>
    <td>
        <a href="https://cdn.generalresearch.com/grl-panel.js">
            <img src="https://cdn.generalresearch.com/buildStatus/icon?subject=master&job=panel-ui%2Fmaster">
        </a>
    </td>
    <td>
        <a href="https://cdn.generalresearch.com/grl-panel-v0.1.1.js">
            <img src="https://cdn.generalresearch.com/buildStatus/icon?subject=v0.1.1&job=panel-ui%2Fv0.1.1">
        </a>
    </td>
 </tr>
 <tr>
    <td>
        <a href="https://cdn.generalresearch.com/grl-panel-dev.js">
            <img src="https://cdn.generalresearch.com/buildStatus/icon?subject=dev&job=panel-ui%2Fdev">
        </a>
    </td>
    <td>
        <a href="https://cdn.generalresearch.com/grl-panel-v0.2.1.js">
            <img src="https://cdn.generalresearch.com/buildStatus/icon?subject=v0.2.1&job=panel-ui%2Fv0.2.1">
        </a>
    </td>
 </tr>
</table>

Please click on the build status badges to access the CDN hosted javascript for you to use.

## How to build your own Panel UI

### Running Development

```
npm install
npm dev
```

### Building Production

```
npm install
npm build
```

If successful, a single file will be generaged at `/dist/grl-panel.js` which you can then use to place on your own CDN
or web server.

## API Documentation and Interfaces

A design pattern and goal of the Panel UI project is to not use any proprietary or custom models or object definitions
within the project itself. By leveraging [openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator-cli)
all the required models and API endpoints can be built from the General
Research [https://fsb.generalresearch.com/redoc/](FSB Documentation) openapi
file [available here](https://fsb.generalresearch.com/openapi.json).

This project contains the prebuilt interfaces and endpoint classes for the API. However, instructions to build it
yourself is available in the [@/src/api/README.md](./src/api/README.md) file.

## License

Panel UI is [MIT licensed](./LICENSE).

> *Do what you want, just give credit.*