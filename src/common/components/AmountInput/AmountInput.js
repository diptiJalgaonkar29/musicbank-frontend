import React from "react";
import "./AmountInput.css"

const AmountInput = () => {
  return (
    <div className="budget-input-wrapper">
      <label htmlFor="musicBudget" className="budget-label">
        Estimated / Available Music Budget <span className="required">*</span>
      </label>

      <div className="budget-input-field">
        <span className="currency-symbol">€</span>
        <input
          type="number"
          id="musicBudget"
          name="musicBudget"
          placeholder="0"
          min="0"
          className="budget-input"
        />
      </div>
    </div>
  );
};

export default AmountInput;
