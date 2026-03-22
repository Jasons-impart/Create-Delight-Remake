StartupEvents.modifyCreativeTab("appliedcreate:main", e => {
  e.remove([
      "appliedcreate:me_gearbox",
      "appliedcreate:kinetic_energy_acceptor",
      "appliedcreate:creative_stress_cell",
      "/appliedcreate:stress_storage_.*/",
      "/appliedcreate:.*board/",
      "/appliedcreate:.*processor/",
      "/appliedcreate:.*housing/"])
})