import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { objectMetadataItemsWithFieldsSelector } from '@/object-metadata/states/objectMetadataItemsWithFieldsSelector';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getStandardObjectLabel } from '@/object-metadata/utils/getStandardObjectLabel';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';

export const objectMetadataItemsSelector = createAtomSelector<
  EnrichedObjectMetadataItem[]
>({
  key: 'objectMetadataItemsSelector',
  get: ({ get }) => {
    const items = get(objectMetadataItemsWithFieldsSelector);
    const locale = get(currentWorkspaceMemberState)?.locale ?? 'en';

    return items.map((item) => ({
      ...item,
      labelSingular: getStandardObjectLabel(
        item.nameSingular,
        item.labelSingular,
        item.labelPlural,
        locale,
        true,
      ),
      labelPlural: getStandardObjectLabel(
        item.nameSingular,
        item.labelSingular,
        item.labelPlural,
        locale,
        false,
      ),
      fields: item.fields.map((field) => ({
        ...field,
        label: field.labelTranslations?.[locale] ?? field.label,
        options: field.options?.map((opt) => ({
          ...opt,
          label:
            field.optionLabelTranslations?.[opt.value]?.[locale] ?? opt.label,
        })) ?? field.options,
      })),
    }));
  },
});
