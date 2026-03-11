"use client";

import { Button } from "@/components/ui/button";

export function BulkActionSubmit(): JSX.Element {
  return (
    <Button
      type="submit"
      size="sm"
      onClick={(event) => {
        const form = event.currentTarget.form;
        if (!form) return;

        const actionInput = form.elements.namedItem("bulkAction");
        if (!(actionInput instanceof HTMLSelectElement)) {
          return;
        }

        if (actionInput.value === "delete") {
          const approved = window.confirm("Delete selected users permanently? This cannot be undone.");
          if (!approved) {
            event.preventDefault();
          }
        }
      }}
    >
      Apply
    </Button>
  );
}
