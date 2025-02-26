import { CreateProductFormValues } from '@/shared/constants/create-product-schema';
import React, { FC } from 'react'
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Checkbox } from '../..';
import { Notes, Types } from '@prisma/client';
import { enumUtil } from 'zod/lib/helpers/enumUtil';


interface Props {
  control: Control<CreateProductFormValues>;
  items: { name: string; value: Notes | Types }[];
  name: keyof CreateProductFormValues;
}
export const FormCheckbox: FC<Props> = ({control, name, items}) => {
  return (
    <FormField
                name="notes"
                control={control}
                render={() => (
                  <FormItem className="mb-5">
                    <div className="mb-4">
                      <FormLabel className="text-base">{`Select ${name}`}</FormLabel>
                    </div>
                    {items.map((item) => (
                      <FormField
                        key={item.name}
                        control={control}
                        name="notes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.name}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value as Notes)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
  )
}
