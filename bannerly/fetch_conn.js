const token = "eyJraWQiOiJUa0hEN1ltOUNaQ2xESHYwazEyTEFhWjk4NTdGOE16dWxYTXJBMFpqbWVrIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ3b3Jrc3BhY2U6Y21zNGNtZm0yMDE1NnhzZjZoazZ3amRhbiIsImp0aSI6Imt2c21mMTc3c2dtbjM2cG02bDNpZ2hieCIsImlhdCI6MTc4NTIyNDY4Nzg5NH0.AAr-Dyo0IviOyLoKd7QiseOSgp6Zy1aVPjdjPjI3jR7mIgrkhDLvGS1wlqmQcsBBiMW0TK9SXn0Gn9-AAoOM3mPiVvWDM57kLQ5DLZzAg5mN0cInSKRgdiGZfw7z_yHPnyQvxqOZ3MBLwGubaoImM_iUqqVMGfD7nFJmklUZvl_rmQ7AtVnFovLh4XakfxnNzRHeIjMVs3wZZlkCFWhEH5ib_b9uwSY_r1ct58fVHO0a-5w6jW-lt-dtaKyqCXqaSW5x1WOm0Mh76KOO33i3Ft-GoD6ZIqshYzOxSKIv7JotqYpHBBnc0P6so0CwIrSRQeJiABgtmUINe4iqL4Dv8g";
fetch('https://api.prisma.io/v1/databases/db_fxgsyj41xwlmptojdy96rhio/connections', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'dev' })
}).then(r => r.json()).then(r => {
  console.log(r.data.endpoints.direct.connectionString);
});
