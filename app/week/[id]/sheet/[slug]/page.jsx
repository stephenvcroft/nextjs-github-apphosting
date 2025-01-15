"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";

import PriceTag from "@/components/PriceTag";
import TextGuide from "@/components/TextGuide";
import ProductImage from "@/components/ProductImage";
import {
  BookOpenCheck,
  CalendarCheck,
  ChevronRight,
  House,
} from "lucide-react";
import Link from "next/link";

const Page = ({ params }) => {
  // Param States
  const week = params.id;
  const sheet = params.slug;

  // States
  const [imageStates, setImageStates] = useState([]);
  const [tagStates, setTagStates] = useState([]);
  const [textStates, setTextStates] = useState([]);

  // Fetch Products Collection
  const fetchProducts = async () => {
    try {
      const subColRef = collection(
        db,
        "week",
        week,
        "sheet",
        sheet,
        "products"
      );
      const querySnapshot = await getDocs(subColRef);

      if (!querySnapshot.empty) {
        const products = querySnapshot.docs.map((doc) => doc.data());

        // imageStates
        const images = products.map((product) => ({
          src: product.image_src,
          pos: { x: product.image_x, y: product.image_y },
          height: product.image_height,
        }));
        setImageStates(images);

        // tagStates
        const tags = products.map((product) => ({
          pos: { x: product.tag_x, y: product.tag_y },
          height: product.tag_height,
        }));
        setTagStates(tags);

        // textStates
        const texts = products.map((product) => ({
          pos: { x: product.text_x, y: product.text_y },
          fontsize: product.text_fontsize,
          title: product.title,
          store: product.store,
          link: product.link,
          price: product.price,
        }));
        setTextStates(texts);
      } else {
        console.error("No products found in the subcollection.");
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Updating States
  const updateImageState = (index, newState) => {
    const newStates = [...imageStates];
    newStates[index] = { ...newStates[index], ...newState };
    setImageStates(newStates);
  };

  const updateTagState = (index, newState) => {
    const newStates = [...tagStates];
    newStates[index] = { ...newStates[index], ...newState };
    setTagStates(newStates);
  };

  const updateTextState = (index, newState) => {
    const newStates = [...textStates];
    newStates[index] = { ...newStates[index], ...newState };
    setTextStates(newStates);
  };

  // UX
  const handleImageHeightChange = (index, newHeight) => {
    const diff = newHeight - imageStates[index].height;
    const newPos = {
      x: Math.round(imageStates[index].pos.x - diff / 2),
      y: Math.round(imageStates[index].pos.y - diff / 2),
    };
    updateImageState(index, { height: newHeight, pos: newPos });
  };

  const handleTagHeightChange = (index, newHeight) => {
    const diff = newHeight - tagStates[index].height;
    const newPos = {
      x: Math.round(tagStates[index].pos.x - diff / 2),
      y: Math.round(tagStates[index].pos.y - diff / 2),
    };
    updateTagState(index, { height: newHeight, pos: newPos });
  };

  const handleFontsizeChange = (index, value) => {
    const parsedValue = parseInt(value, 10);
    setTextStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = { ...updatedStates[index], fontsize: parsedValue };
      return updatedStates;
    });
  };

  const handleTitleChange = (index, value) => {
    setTextStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = { ...updatedStates[index], title: value };
      return updatedStates;
    });
  };

  const handleStoreChange = (index, value) => {
    setTextStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = { ...updatedStates[index], store: value };
      return updatedStates;
    });
  };

  const handleLinkChange = (index, value) => {
    setTextStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = { ...updatedStates[index], link: value };
      return updatedStates;
    });
  };

  const handlePriceChange = (index, value) => {
    setTextStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = { ...updatedStates[index], price: value };
      return updatedStates;
    });
  };

  // Focus
  const focusOnInput = (index) => {
    document.getElementById(index).focus();
  };

  // useEffect states
  useEffect(() => {
    buildCode(imageStates, tagStates, textStates);
  }, [imageStates, tagStates, textStates]);

  // Save Changes
  const saveChanges = async () => {
    try {
      const batch = writeBatch(db);

      imageStates.forEach((item, index) => {
        const image = imageStates[index];
        const tag = tagStates[index];
        const text = textStates[index];

        const update = {
          image_src: image.src,
          image_x: image.pos.x,
          image_y: image.pos.y,
          image_height: image.height,
          tag_x: tag.pos.x,
          tag_y: tag.pos.y,
          tag_height: tag.height,
          text_x: text.pos.x,
          text_y: text.pos.y,
          text_fontsize: text.fontsize,
          title: text.title,
          store: text.store,
          link: text.link,
          price: text.price,
        };

        const docRef = doc(
          db,
          "week",
          week,
          "sheet",
          sheet,
          "products",
          String(index + 1)
        );

        batch.update(docRef, update);
      });

      await batch.commit();
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes: ", error);
    }
  };

  // Build Code
  const [code, setCode] = useState("");

  function buildCode(imageStates, tagStates, textStates) {
    // imageStrings
    const imageStrings = imageStates
      .map((item, index) => {
        const ptX = Math.ceil(item.pos.x * 0.75);
        const ptY = Math.ceil(item.pos.y * 0.75);
        const ptHeight = Math.ceil(item.height * 0.75);
        const link = textStates[index].link;

        return `doc.image("public/week-${week}/sheet-${sheet}/${item.src}", ${ptX}, ${ptY}, { width: ${ptHeight}, link: "${link}" });`;
      })
      .join("\n");

    // textStrings
    const textStrings = textStates
      .map((item, index) => {
        const yShift = item.fontsize; // Retain the working fix for now
        const ptFontSize1 = Math.ceil(item.fontsize * 0.75);
        const ptFontSize2 = Math.ceil(ptFontSize1 * 0.8);
        const ptX = Math.ceil(item.pos.x * 0.75);
        const ptY1 = Math.ceil(item.pos.y * 0.75) + yShift;
        const ptY2 = ptY1 + ptFontSize1;

        return `doc.fontSize(${ptFontSize1}).text("${item.title}", ${ptX}, ${ptY1});\ndoc.fontSize(${ptFontSize2}).text("${item.store}", ${ptX}, ${ptY2});`;
      })
      .join("\n");

    // tagStrings
    const tagStrings = tagStates
      .map((item) => {
        const ptX = Math.ceil(item.pos.x * 0.75);
        const ptY = Math.ceil(item.pos.y * 0.75);
        const ptHeight = Math.ceil(item.height * 0.75);

        return `doc.image("public/tags/tag.png", ${ptX}, ${ptY}, { width: ${ptHeight} });`;
      })
      .join("\n");

    // change fill color
    const fillColor = `doc.fillColor("white");`;

    // priceStrings
    const priceStrings = tagStates
      .map((item, index) => {
        const ptFontSize = Math.ceil(item.height / 2.5) * 0.75;
        const ptX = Math.ceil(item.pos.x * 0.75);
        const ptHeight = Math.ceil(item.height * 0.75);
        const ptY = Math.ceil((item.pos.y + item.height / 1.5) * 0.75);
        const price = textStates[index].price;

        return `doc.fontSize(${ptFontSize}).text("$${price}", ${ptX}, ${ptY}, { width: ${ptHeight}, align: "center" });`;
      })
      .join("\n");

    setCode(
      [imageStrings, textStrings, tagStrings, fillColor, priceStrings].join(
        "\n"
      )
    );
  }

  // Genrate Pdf
  const generatePdf = async () => {

alert("Call API")


    // const week = "01";
    // const sheet = "01";
    // const theme = "baby";

    // try {
    //   const response = await fetch("/api/generate-pdf", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ week, sheet, theme, code }),
    //   });

    //   if (response.ok) {
    //     const blob = await response.blob(); // Get the binary response as a Blob
    //     const url = URL.createObjectURL(blob); // Create an object URL from the blob
    //     window.open(url, "_blank"); // Open the PDF in a new window
    //   } else {
    //     const errorData = await response.text();
    //     console.error("Error:", errorData);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  return (
    <div className="flex flex-col items-center mb-96">
      {/* BREADCRUMB */}
      <div className="w-full h-8 flex items-center px-1 border-b bg-gray-50 space-x-1 text-gray-400">
        <Link href="/">
          <House size={20} />
        </Link>
        <ChevronRight size={20} />
        <Link href={`/week/${week}`}>
          <CalendarCheck size={20} />
        </Link>
        <ChevronRight size={20} />
        <BookOpenCheck size={20} className="text-black" />
      </div>

      {/* DRAGGABLE AREA */}
      <div className="flex justify-center mt-2 space-x-6">
        <div
          id="draggable-container"
          className="relative w-[816px] h-[1056px] border bg-white overflow-hidden"
        >
          {/* Header & Footer */}
          <div className="absolute w-full h-[160px] bg-gray-300" />
          <div className="absolute w-full h-[80px] top-[976px] bg-gray-300" />
          {/* Images */}
          {imageStates.map((item, index) => (
            <div key={index} onMouseUp={() => focusOnInput("image_" + index)}>
              <ProductImage
                containerId="draggable-container"
                src={`/week-${week}/sheet-${sheet}/${item.src}`}
                pos={item.pos}
                h={item.height}
                onPositionChange={(newPos) =>
                  updateImageState(index, { pos: newPos })
                }
              />
            </div>
          ))}
          {/* Tags */}
          {tagStates.map((item, index) => (
            <div key={index} onMouseUp={() => focusOnInput("tag_" + index)}>
              <PriceTag
                containerId="draggable-container"
                pos={item.pos}
                h={item.height}
                onPositionChange={(newPos) =>
                  updateTagState(index, { pos: newPos })
                }
              />
            </div>
          ))}
          {/* Text Guide */}
          {textStates.map((item, index) => (
            <div key={index} onMouseUp={() => focusOnInput("text_" + index)}>
              <TextGuide
                containerId="draggable-container"
                pos={item.pos}
                fontsize={item.fontsize}
                title={item.title}
                store={item.store}
                onPositionChange={(newPos) =>
                  updateTextState(index, { pos: newPos })
                }
              />
            </div>
          ))}
        </div>

        {/* DIMS PANEL */}
        <div className="flex flex-col justify-center space-y-4">
          {imageStates.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center p-2 space-y-1 rounded border"
            >
              {/* Title, Store, Link */}
              <div className="flex flex-col space-y-1">
                <input
                  type="text"
                  className="w-60 h-6 rounded border outline-0 text-center"
                  value={textStates[index].title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                />
                <input
                  type="text"
                  className="w-60 h-6 rounded border outline-0 text-center"
                  value={textStates[index].store}
                  onChange={(e) => handleStoreChange(index, e.target.value)}
                />
                <input
                  type="text"
                  className="w-60 h-6 rounded border outline-0 text-center text-sm"
                  value={textStates[index].link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
                <div className="flex justify-center space-x-1">
                  <span>$</span>
                  <input
                    type="number"
                    className="w-20 h-6 rounded border outline-0 text-center text-sm"
                    value={textStates[index].price}
                    onChange={(e) => handlePriceChange(index, e.target.value)}
                  />
                </div>
              </div>
              {/* Pos & Height */}
              <div className="flex justify-center space-x-2">
                {/* Image Height */}
                <div className="flex items-center space-x-1">
                  <span>ih:</span>
                  <input
                    id={`image_${index}`}
                    type="number"
                    className="pl-4 w-16 h-6 rounded border outline-0 text-center"
                    value={imageStates[index].height}
                    onChange={(e) =>
                      handleImageHeightChange(index, e.target.value)
                    }
                  />
                </div>
                {/* Tag Height */}
                <div className="flex items-center space-x-1">
                  <span>th:</span>
                  <input
                    id={`tag_${index}`}
                    type="number"
                    className="pl-4 w-16 h-6 rounded border outline-0 text-center"
                    value={tagStates[index].height}
                    onChange={(e) =>
                      handleTagHeightChange(index, e.target.value)
                    }
                  />
                </div>
                {/* Text Fontsize */}
                <div className="flex items-center space-x-1">
                  <span>fs:</span>
                  <input
                    id={`text_${index}`}
                    type="number"
                    className="pl-4 w-16 h-6 rounded border outline-0 text-center"
                    value={textStates[index].fontsize}
                    onChange={(e) =>
                      handleFontsizeChange(index, e.target.value)
                    }
                  />
                </div>
              </div>
              {/* Label */}
              <div className="absolute -top-3 -left-3 w-6 h-6 flex justify-center items-center rounded-full border text-xs bg-white">
                {index + 1}
              </div>
            </div>
          ))}
          {/* Save */}
          <div className="flex justify-center space-x-2">
            <button
              className="w-32 py-1 rounded bg-blue-500 font-medium text-white opacity-80 hover:opacity-100"
              onClick={saveChanges}
            >
              SAVE DATA
            </button>
            <button
              className="w-32 py-1 rounded bg-green-500 font-medium text-white opacity-80 hover:opacity-100"
              onClick={generatePdf}
            >
              GENERATE PDF
            </button>
          </div>
        </div>
      </div>

      {/* CODE SNIPPETS */}
      <textarea
        className="mt-2 w-[1130px] min-h-[800px] p-4 bg-gray-700 text-white rounded border-0 outline-none resize-y"
        onFocus={(e) => e.target.select()}
        value={code}
        readOnly
      />
    </div>
  );
};

export default Page;
