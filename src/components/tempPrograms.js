export function mapArea(program, researchAreas) {
    // to do: prepare a better algo for the demo
    let area = researchAreas.find(a => {
        return a.subAreas.some(sa => sa.disciplines.some(d => program.disciplines.includes(d)));
    });
    let subArea = area.subAreas.find(sa => sa.disciplines.some(d => program.disciplines.includes(d)));
    program.area = area;
    program.subArea = subArea;
}

export const originalCorePrograms = [
    { agency: "nsf", title: "Cyber-Human Systems (CHS)", postedDate: new Date(), closingDate: new Date(), number: "PAR-19-36", award: 50000, disciplines: [140], estimatedTotalFunding: 500053, expectedNumberOfAwards: 5, awardCeiling: 1055, awardFloor: 543, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')" },
    { agency: "nsf", title: "Atomic, Molecular and Optical Physics - Theory", postedDate: new Date(), closingDate: new Date(), number: "PAR-20-36", award: 100000, disciplines: [4], estimatedTotalFunding: 32425245, expectedNumberOfAwards: 10, awardCeiling: 7534, awardFloor: 43, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')" },
    { agency: "nsf", title: "Improvements to Biological Field Stations and Marine Laboratories (FSML)", postedDate: new Date(), closingDate: new Date(), number: "PAR-21-36", award: 100000, disciplines: [3], estimatedTotalFunding: 42342324, expectedNumberOfAwards: 15, awardCeiling: 433, awardFloor: 342, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"  }
];

export const originalAdditionalPrograms = [
    { agency: "nsf", title: "Collaborative Research in Computational Neuroscience (CRCNS)", postedDate: new Date(), closingDate: new Date(), number: "PAR-23-36", award: 130000, disciplines: [3], estimatedTotalFunding: 5454278, expectedNumberOfAwards: 20, awardCeiling: 432, awardFloor: 423, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"  },
    { agency: "nsf", title: "Computer Science for All (CSforAll:RPP)", postedDate: new Date(), closingDate: new Date(), number: "PAR-25-36", award: 940000, disciplines: [8], estimatedTotalFunding: 23421432423, expectedNumberOfAwards: 25, awardCeiling: 532, awardFloor: 324, awardFloor: 42, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"   },
    { agency: "nsf", title: "Critical Techniques, Technologies and Methodologies for Advancing Foundations and Applications of Big Data Sciences and Engineering (BIGDATA)", postedDate: new Date(), closingDate: new Date(), number: "PAR-25-36", award: 900000, disciplines: [135], estimatedTotalFunding: 5345345, expectedNumberOfAwards: 30, awardCeiling: 244, awardFloor: 12, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')" },
    { agency: "nsf", title: "Cyber-Physical Systems (CPS)", postedDate: new Date(), closingDate: new Date(), number: "PAR-26-36", award: 540000, disciplines: [151], estimatedTotalFunding: 8900779676, expectedNumberOfAwards: 35, awardCeiling: 645, awardFloor: 34, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"  },
    { agency: "nsf", title: "Cyberlearning for Work at the Human-Technology Frontier", postedDate: new Date(), closingDate: new Date(), number: "PAR-27-36", award: 80000, disciplines: [140], estimatedTotalFunding: 8748927, expectedNumberOfAwards: 40, awardCeiling: 534, awardFloor: 54, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"  },
    { agency: "nsf", title: "Designing Materials to Revolutionize and Engineer our Future (DMREF)", postedDate: new Date(), closingDate: new Date(), number: "PAR-28-36", award: 30000, disciplines: [80, 81], estimatedTotalFunding: 53453 , expectedNumberOfAwards: 45, awardCeiling: 54, awardFloor: 24, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"  },
    { agency: "nsf", title: "Expeditions in Computing", postedDate: new Date(), closingDate: new Date(), number: "PAR-30-36", award: 80000, disciplines: [10], estimatedTotalFunding: 35344, expectedNumberOfAwards: 50, awardCeiling: 643, awardFloor: 43, eligibleApplicantsText: "Others (see text field entitled 'Additional.... ')"  }
];
