"use client";

import React from "react";

class Colon extends React.Component {
  constructor(props) {
    super(props);
  }

  transform(functions) {
    return functions.reduce((funcs, func) => {
      var name = Object.keys(func)[0];
      var params = Array.isArray(func[name]) ? func[name] : [func[name]];
      return `${funcs} ${name}(${params.join(" ")})`;
    }, "");
  }

  render() {
    return (
      <svg
        viewBox={[-1, -1, 12, 20]}
        className={this.props.className}
        style={
          this.props.backgroundColor
            ? { background: this.props.backgroundColor }
            : {}
        }
      >
        <g
          transform={this.transform([
            { translate: [this.props.x, this.props.y] },
          ])}
          style={{
            fillRule: "evenodd",
            stroke: this.props.strokeColor || this.props.strokeColour,
            strokeWidth: 0.25,
            strokeOpacity: 1,
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
          }}
        >
          <circle
            cx={12 / 2}
            cy={20 / 3}
            r={1}
            fill={this.props.color}
            fillOpacity={
              this.props.on ? this.props.onOpacity : this.props.offOpacity
            }
          />
          <circle
            cx={12 - 12 / 2}
            cy={20 - 20 / 3}
            r={1}
            fill={this.props.color}
            fillOpacity={
              this.props.on ? this.props.onOpacity : this.props.offOpacity
            }
          />
        </g>
      </svg>
    );
  }
}

Colon.defaultProps = {
  on: true,
  onOpacity: 1,
  offOpacity: 0.15,
  color: "green",
  strokeColor: "#fff",
  x: 0,
  y: 0,
  className: "",
  backgroundColor: null,
};

export default Colon;
