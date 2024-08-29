// JSON data
const jsonData = [
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Administration",
        "Sub": "Country boundary",
        "Link": "https://www.google.com/maps/d/edit?mid=1v7r6yWcdfMy0iGX2tC6bcws_pXPc3Q0&usp=sharing"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Administration",
        "Sub": "Provincial boundary",
        "Link": "https://www.google.com/maps/d/edit?mid=1q5gx6lAOJCn1McamPlCL8AT4owO5FL4&usp=sharing"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Administration",
        "Sub": "District boundary",
        "Link": "https://www.google.com/maps/d/edit?mid=1ecc2dcXcQeuKlH2XlFsGBliOYYiCKcc&usp=sharing"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Administration",
        "Sub": "DS boundary",
        "Link": "https://www.google.com/maps/d/edit?mid=1ecc2dcXcQeuKlH2XlFsGBliOYYiCKcc&usp=sharing"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Administration",
        "Sub": "GN boundary",
        "Link": "https://www.google.com/maps/d/edit?mid=1ecc2dcXcQeuKlH2XlFsGBliOYYiCKcc&usp=sharing"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Hydrology",
        "Sub": "Drainage network",
        "Link": "DRN"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Hydrology",
        "Sub": "Mini watershed",
        "Link": "MWS"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Hydrology",
        "Sub": "Irrigation scheme",
        "Link": "IRS"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Reservation",
        "Sub": "Forest cover",
        "Link": "FRC"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Reservation",
        "Sub": "National Park",
        "Link": "NTP"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Reservation",
        "Sub": "Environmental protection area",
        "Link": "EPA"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Land cover",
        "Sub": "Land Use Land Cover",
        "Link": "LULC"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Soil related data",
        "Sub": "Soil type",
        "Link": "SLT"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Topography",
        "Sub": "Spot height",
        "Link": "SPH"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Topography",
        "Sub": "Contour",
        "Link": "CTR"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Socio-economic data",
        "Sub": "Population",
        "Link": "PPL"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Socio-economic data",
        "Sub": "Economics",
        "Link": "ECN"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Socio-economic data",
        "Sub": "Household",
        "Link": "HHD"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Transportation",
        "Sub": "Road type",
        "Link": "RDT"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Places",
        "Sub": "Town",
        "Link": "TWN"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Places",
        "Sub": "Village",
        "Link": "VLG"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Meteorology",
        "Sub": "Climatic zone",
        "Link": "CLZ"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Meteorology",
        "Sub": "Agro-ecological zone",
        "Link": "AEZ"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Hazard and risk",
        "Sub": "Landslide",
        "Link": "LDS"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Hazard and risk",
        "Sub": "Flood",
        "Link": "FLD"
    },
    {
        "Main": "Spatial Data (Existing data)",
        "Type": "Hazard and risk",
        "Sub": "Forest fire",
        "Link": "FRF"
    },
    {
        "Main": "Field Data",
        "Type": "Soil",
        "Sub": "Field data",
        "Link": "FLD1"
    },
    {
        "Main": "Field Data",
        "Type": "Soil",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Soil",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Forestry",
        "Sub": "Field data",
        "Link": "FLD2"
    },
    {
        "Main": "Field Data",
        "Type": "Forestry",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Forestry",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Wildlife",
        "Sub": "Field data",
        "Link": "FLD3"
    },
    {
        "Main": "Field Data",
        "Type": "Wildlife",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Wildlife",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Hydrology",
        "Sub": "Field data",
        "Link": "FLD4"
    },
    {
        "Main": "Field Data",
        "Type": "Hydrology",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Hydrology",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Water Resources Development",
        "Sub": "Field data",
        "Link": "FLD5"
    },
    {
        "Main": "Field Data",
        "Type": "Water Resources Development",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Water Resources Development",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Water quality",
        "Sub": "Field data",
        "Link": "FLD6"
    },
    {
        "Main": "Field Data",
        "Type": "Water quality",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Water quality",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Tea",
        "Sub": "Field data",
        "Link": "FLD7"
    },
    {
        "Main": "Field Data",
        "Type": "Tea",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Tea",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Product Development and Marketing",
        "Sub": "Field data",
        "Link": "FLD8"
    },
    {
        "Main": "Field Data",
        "Type": "Product Development and Marketing",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Product Development and Marketing",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Eco-Tourism",
        "Sub": "Field data",
        "Link": "FLD9"
    },
    {
        "Main": "Field Data",
        "Type": "Eco-Tourism",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Eco-Tourism",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Livelihood",
        "Sub": "Field data",
        "Link": "FLD10"
    },
    {
        "Main": "Field Data",
        "Type": "Livelihood",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Livelihood",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Field Data",
        "Type": "Capacity Development",
        "Sub": "Field data",
        "Link": "FLD11"
    },
    {
        "Main": "Field Data",
        "Type": "Capacity Development",
        "Sub": "Proposal",
        "Link": "PPR"
    },
    {
        "Main": "Field Data",
        "Type": "Capacity Development",
        "Sub": "Images",
        "Link": "IMG"
    },
    {
        "Main": "Document",
        "Type": "Reports",
        "Sub": "Report",
        "Link": "RP1"
    },
    {
        "Main": "Document",
        "Type": "Maps",
        "Sub": "Map 1",
        "Link": "MP1"
    }
];
