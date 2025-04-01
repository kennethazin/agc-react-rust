"use client";
import React from "react";
import Digit from "./Digit";

class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      digitCount,
      value,
      color,
      strokeColor,
      digitProps,
      nullDisplay,
      className,
      showPlusSign,
      backgroundColor,
    } = this.props;

    // Handle value processing and potential plus sign
    let displayValue = value.toString();
    let isPositive = displayValue.startsWith("+");
    let hasExplicitSign =
      displayValue.startsWith("+") || displayValue.startsWith("-");

    // If we need to show plus sign but it's not there and the value is positive
    if (
      showPlusSign &&
      !isPositive &&
      !displayValue.startsWith("-") &&
      parseFloat(displayValue) > 0
    ) {
      displayValue = "+" + displayValue;
      hasExplicitSign = true;
    }
    // If we don't want to show plus sign and it's there
    else if (!showPlusSign && isPositive) {
      displayValue = displayValue.substring(1);
      hasExplicitSign = false;
    }

    // Calculate padding considering the sign
    const effectiveDigitCount = hasExplicitSign ? digitCount - 1 : digitCount;
    let paddedValue = hasExplicitSign
      ? displayValue.charAt(0) +
        displayValue.substring(1).padStart(effectiveDigitCount, " ")
      : displayValue.padStart(digitCount, " ");

    const digits = paddedValue.split("").slice(-digitCount);

    return (
      <svg
        viewBox={[-1, -1, 12 * digitCount, 20]}
        className={className}
        style={backgroundColor ? { background: backgroundColor } : {}}
      >
        {digits.map((digit, key) => (
          <Digit
            key={key}
            value={digit}
            x={key * 12}
            color={digitProps?.color || color}
            strokeColor={strokeColor}
            onOpacity={digitProps?.onOpacity}
            offOpacity={digitProps?.offOpacity}
            nullDisplay={nullDisplay}
          />
        ))}
      </svg>
    );
  }
}

Display.defaultProps = {
  digitCount: 2,
  value: "",
  color: "#ff0000",
  strokeColor: "#fff",
  digitProps: {
    onOpacity: 0.9,
    offOpacity: 0.25,
  },
  nullDisplay: [],
  className: "",
  showPlusSign: false,
};

export default Display;
