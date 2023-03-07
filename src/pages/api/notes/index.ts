import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../prisma/db";

type TReq = {
  query?: {
    id: string
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (req.method === "POST") {
      const data = req.body;
      const createNote = await db.notes.create({
        data: data,
        select: {
          title: true,
          note: true,
          author: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: createNote
      })
    }

    if (req.method === "DELETE") {
      if (!req.query.id) {
        return res.status(401).json({
          success: false,
          massage: "Query must be id"
        })
      }
      const { id }: Partial<{ id: string }> = req.query;
      const findNote = await db.notes.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!findNote) {
        return res.status(401).json({
          success: false,
          massage: "Note not found!"
        })
      }

      const deleteNotes = await db.notes.deleteMany({
        where: {
          id: findNote.id,
        },
      })

      return res.status(201).json({
        success: true,
        data: deleteNotes
      })
    }

    const result = await db.notes.findMany({
      // select: {
      //   title: true,
      //   note: true,
      //   author: true,
      // },
    })
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (er) {
    return res.status(401).json({
      success: false,
      error: er
    })
  }
};

export default handler;
