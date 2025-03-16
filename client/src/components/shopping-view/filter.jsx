import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-sm h-full">
      <div className="p-3 sm:p-4 border-b sticky top-0 bg-background z-10">
        <h2 className="text-base sm:text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-3 sm:p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-2">{keyItem}</h3>
              <div className="grid gap-3">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer touch-target-16"
                  >
                    <Checkbox
                      className="h-5 w-5"
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    <span className="text-sm sm:text-base font-medium">
                      {option.label}
                    </span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator className="last:hidden" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
