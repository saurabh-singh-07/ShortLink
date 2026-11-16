import { Request, Response } from "express"
import { pool } from "../config/db.js";

export const getUrlAnalytics = async (req : Request, res : Response) : Promise<void> => {
    try {
        const userId = res.locals.userId;
        const {id} = req.params;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if(typeof id !== "string" || !uuidRegex.test(id)){
            res.status(400).json({
                success : false,
                message : "Invalid URL ID..."
            })
            return ;
        }

        const days = Number(req.query.days ?? 30);

        if(!Number.isInteger(days) || days < 1 || days > 365){
            res.status(400).json({
                success : false,
                message : "Days must be between 1 and 365",
            })
            return;
        }

        const urlResult = await pool.query(
            `SELECT id, short_code, original_url, title
            FROM urls
            WHERE id = $1 AND user_id = $2`,[id,userId]
        );

        if(urlResult.rows.length === 0){
            res.status(404).json({
                success : false,
                message : "URL not found",
            })
            return;
        }

        const url = urlResult.rows[0];

        const totalResult = await pool.query(
            `SELECT COUNT(*)::INT AS total_clicks
            FROM click_events
            where url_id = $1
            AND clicked_at >= now() - ($2 * interval '1 day')`,[id,days]
        )

        const dailyResult = await pool.query(
            `SELECT DATE(clicked_at) AS date,
            COUNT(*) ::INT AS clicks
            FROM click_events
            WHERE url_id = $1
            AND clicked_at >= NOW() - ($2 * INTERVAL '1 day')
            GROUP BY DATE(clicked_at)
            ORDER BY DATE(clicked_at)`,[id, days]
        )

        const deviceResult = await pool.query(
            `SELECT device_type AS device,
            COUNT(*)::INT AS clicks
            FROM click_events
            where url_id = $1
            AND clicked_at >= NOW() - ($2 * INTERVAL '1 day')
            GROUP BY device_type 
            ORDER BY clicks DESC`,[id,days]
        )

        const browserResult = await pool.query(
            `SELECT browser, COUNT(*)::INT AS clicks
            FROM click_events
            WHERE url_id = $1
            AND clicked_at >= NOW() - ($2 * INTERVAL '1 day')
            GROUP BY browser
            ORDER BY clicks DESC`,[id, days]
        )

        const referrerResult = await pool.query(`
            SELECT COALESCE(referrer, 'Direct/ Unknown') AS referrer,
            COUNT(*)::INT AS clicks
            FROM click_events 
            where url_id = $1
            and clicked_at >= now() - ($2 * interval '1 day')
            group by referrer
            order by clicks desc
            limit 10`,[id, days])

        res.status(200).json({
            success : true,
            analytics : {
                url : {
                    id : url.id,
                    title : url.title,
                    shortCode : url.short_code,
                    originalUrl : url.original_url,
                },
                period : `${days} days`,
                totalClicks : totalResult.rows[0].total_clicks,
                dailyClicks : dailyResult.rows,
                devices : deviceResult.rows,
                browers : browserResult.rows,
                referrers : referrerResult.rows,
            }
        })
    } catch (error) {
        console.error("Analytic error :", error);
        res.status(500).json({
            success : false,
            message : "Failed to fetch URL analytics"
        })
    }
}