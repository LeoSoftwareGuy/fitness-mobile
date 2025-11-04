import { BottomSheetFlashList } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { cssInterop } from "nativewind";

cssInterop(FlashList, {
  className: true,
  contentContainerClassName: "contentContainerStyle",
});

cssInterop(BottomSheetFlashList, {
  className: true,
  contentContainerClassName: "contentContainerStyle",
});
