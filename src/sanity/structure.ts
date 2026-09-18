import type { StructureResolver } from "sanity/structure";

const SINGLETONS: { id: string; type: string; title: string }[] = [
  { id: "homePage", type: "homePage", title: "Homepage" },
  { id: "aboutPage", type: "aboutPage", title: "About" },
  { id: "workPage", type: "workPage", title: "Work" },
  { id: "contactPage", type: "contactPage", title: "Contact" },
  { id: "introVideo", type: "introVideo", title: "Intro Video" },
  { id: "contactSettings", type: "contactSettings", title: "Contact Form Settings" },
  { id: "siteStyle", type: "siteStyle", title: "Site Style" },
  { id: "siteSettings", type: "siteSettings", title: "Site Settings" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("MOVEL")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              SINGLETONS.filter((s) => s.id.endsWith("Page")).map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(s.id)
                  .child(S.document().schemaType(s.type).documentId(s.id))
              )
            )
        ),
      S.divider(),
      S.listItem().title("Projects").schemaType("project").child(S.documentTypeList("project").title("Projects")),
      S.listItem().title("Brands").schemaType("brand").child(S.documentTypeList("brand").title("Brands")),
      S.listItem().title("FAQ").schemaType("faq").child(S.documentTypeList("faq").title("FAQ")),
      S.listItem().title("Socials").schemaType("social").child(S.documentTypeList("social").title("Socials")),
      S.divider(),
      S.listItem()
        .title("Intro Video")
        .id("introVideo")
        .child(S.document().schemaType("introVideo").documentId("introVideo")),
      S.listItem()
        .title("Contact Form Settings")
        .id("contactSettings")
        .child(S.document().schemaType("contactSettings").documentId("contactSettings")),
      S.listItem()
        .title("Site Style")
        .id("siteStyle")
        .child(S.document().schemaType("siteStyle").documentId("siteStyle")),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);

export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set(SINGLETONS.map((s) => s.type));
