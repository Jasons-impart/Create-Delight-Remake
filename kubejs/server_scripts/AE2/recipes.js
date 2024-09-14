ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements } = event.recipes;

  vintageimprovements.curving("ae2:printed_calculation_processor", "ae2:certus_quartz_crystal",1,'ae2:calculation_processor_press');
});
